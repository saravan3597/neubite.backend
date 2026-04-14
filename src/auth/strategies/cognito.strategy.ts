import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { decode } from 'jsonwebtoken';
import JwksClient from 'jwks-rsa';

// ── Local JWKS cache ──────────────────────────────────────────────────────────
// Persists signing keys to disk so auth works even when Cognito JWKS endpoint
// is unreachable (VPN, firewall, offline dev).
const CACHE_FILE = join(process.cwd(), '.cognito-jwks-cache.json');

function loadLocalCache(): Map<string, string> {
  const map = new Map<string, string>();
  if (!existsSync(CACHE_FILE)) return map;
  try {
    const entries: { kid: string; publicKey: string }[] = JSON.parse(
      readFileSync(CACHE_FILE, 'utf-8'),
    );
    entries.forEach(({ kid, publicKey }) => map.set(kid, publicKey));
  } catch {
    // corrupt cache — ignore
  }
  return map;
}

function saveLocalCache(map: Map<string, string>): void {
  try {
    const entries = Array.from(map.entries()).map(([kid, publicKey]) => ({
      kid,
      publicKey,
    }));
    writeFileSync(CACHE_FILE, JSON.stringify(entries, null, 2));
  } catch {
    // non-fatal
  }
}

// ── Strategy ─────────────────────────────────────────────────────────────────

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy, 'cognito') {
  private readonly logger = new Logger(CognitoStrategy.name);

  constructor(configService: ConfigService) {
    const region     = configService.getOrThrow<string>('COGNITO_REGION');
    const userPoolId = configService.getOrThrow<string>('COGNITO_USER_POOL_ID');
    const jwksUri    = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
    const issuer     = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

    // Must be a local variable (not this.logger) — used inside super() closure
    const log        = new Logger('CognitoStrategy');
    const localCache = loadLocalCache();
    const client     = JwksClient({ jwksUri, cache: true, rateLimit: true, jwksRequestsPerMinute: 5, timeout: 8000 });

    log.log(`JWKS URI: ${jwksUri}`);
    if (localCache.size > 0) {
      log.log(`Local JWKS cache loaded (${localCache.size} key(s)) — will use as fallback if network is unreachable`);
    } else {
      log.warn(`No local JWKS cache found — first request requires network access to Cognito`);
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      issuer,
      secretOrKeyProvider: async (_req, rawJwtToken: string, done) => {
        try {
          const decoded = decode(rawJwtToken, { complete: true });
          const kid     = decoded?.header?.kid as string | undefined;
          if (!kid) return done(new Error('Token header is missing kid'));

          // ── Try network ────────────────────────────────────────────────────
          try {
            const key       = await client.getSigningKey(kid);
            const publicKey = key.getPublicKey();
            localCache.set(kid, publicKey);
            saveLocalCache(localCache);
            return done(null, publicKey);
          } catch (networkErr: any) {
            log.warn(
              `JWKS network fetch failed (${networkErr?.message ?? networkErr?.code ?? 'unknown'}) — trying local cache`,
            );
          }

          // ── Fall back to local cache ───────────────────────────────────────
          const cached = localCache.get(kid);
          if (cached) {
            log.warn(`Using cached public key for kid=${kid}`);
            return done(null, cached);
          }

          log.error(`No cached key for kid=${kid}. Run: npm run seed:jwks`);
          return done(new Error(`No signing key available for kid=${kid}`));
        } catch (err: any) {
          done(err);
        }
      },
    });
  }

  validate(payload: { sub: string; email: string; token_use?: string }) {
    if (payload.token_use && payload.token_use !== 'id') {
      throw new UnauthorizedException(
        `Expected idToken but received token_use=${payload.token_use}. Send the Cognito idToken, not the accessToken.`,
      );
    }
    if (!payload.sub) throw new UnauthorizedException('Token is missing sub claim');
    return { userId: payload.sub, email: payload.email };
  }
}
