import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SentryModule } from "@sentry/nestjs/setup";
import { modules } from "./modules";
import { configLoads } from "./configs";

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: [
        ".env.local",
        ".env.development",
        ".env.production",
        ".env",
      ],
      isGlobal: true,
      cache: true,
      load: configLoads,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        autoLoadEntities: true,
        synchronize: false,
        entities: ["@/entities/*.entity.ts"],
        ssl: {
          ca: configService.get("DB_CA"),
        },
      }),
      inject: [ConfigService],
    }),
    ...modules,
  ],
})
export class AppModule {}