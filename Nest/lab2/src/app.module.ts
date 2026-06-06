import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { Todo } from './todo/entities/todo.entity';

@Module({
  imports: [
    // load .env and make ConfigService available everywhere
    ConfigModule.forRoot({ isGlobal: true }),

    // configure the Postgres connection from environment variables
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'todouser'),
        password: config.get<string>('DB_PASSWORD', 'todopass'),
        database: config.get<string>('DB_DATABASE', 'todolab'),
        entities: [Todo],
        synchronize: true, // auto-creates tables in dev (don't use in production)
      }),
    }),

    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
