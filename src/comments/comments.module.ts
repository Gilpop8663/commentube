import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsResolver } from './comments.resolver';

@Module({
  providers: [CommentsService, CommentsResolver],
  controllers: [CommentsController]
})
export class CommentsModule {}
