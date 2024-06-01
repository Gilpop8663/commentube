import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { CreateVideoInput, CreateVideoOutput } from './dtos/create-video.dto';
import { Video } from './entities/video.entity';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dtos/create-comment.dto';
import { CommentReply } from './entities/comment-reply.entity';
import { Comment } from './entities/comment.entity';
import { EditCommentInput, EditCommentOutput } from './dtos/edit-comment.dto';
import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dtos/delete-comment.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentService: CommentsService) {}

  @Mutation(() => CreateVideoOutput)
  createVideo(@Args('input') createVideoInput: CreateVideoInput) {
    console.log(createVideoInput);
    return this.commentService.createVideo(createVideoInput);
  }

  @Mutation(() => CreateCommentOutput)
  createComment(
    @Args('videoUrl') videoUrl: string,
    @Args('input') createCommentInput: CreateCommentInput,
  ) {
    return this.commentService.createComment(videoUrl, createCommentInput);
  }

  @Mutation(() => CreateCommentOutput)
  createReply(
    @Args('commentId') commentId: number,
    @Args('input') createCommentInput: CreateCommentInput,
  ) {
    return this.commentService.createReply(commentId, createCommentInput);
  }

  @Mutation(() => EditCommentOutput)
  editComment(
    @Args('commentId') commentId: number,
    @Args('input') editCommentInput: EditCommentInput,
  ) {
    return this.commentService.editComment(commentId, editCommentInput);
  }

  @Mutation(() => EditCommentOutput)
  editReply(
    @Args('replyId') replyId: number,
    @Args('input') editCommentInput: EditCommentInput,
  ) {
    return this.commentService.editReply(replyId, editCommentInput);
  }

  @Mutation(() => DeleteCommentOutput)
  deleteComment(
    @Args('commentId') commentId: number,
    @Args('input') deleteCommentInput: DeleteCommentInput,
  ) {
    return this.commentService.deleteComment(commentId, deleteCommentInput);
  }

  @Mutation(() => DeleteCommentOutput)
  deleteReply(
    @Args('replyId') replyId: number,
    @Args('input') deleteCommentInput: DeleteCommentInput,
  ) {
    return this.commentService.deleteReply(replyId, deleteCommentInput);
  }

  @Mutation(() => CoreOutput)
  likeVideo(
    @Args('videoId') videoId: number,
    @Args('isIncrement') isIncrement: boolean,
  ) {
    return this.commentService.likeVideo(videoId, isIncrement);
  }

  @Mutation(() => CoreOutput)
  dislikeVideo(
    @Args('videoId') videoId: number,
    @Args('isIncrement') isIncrement: boolean,
  ) {
    return this.commentService.dislikeVideo(videoId, isIncrement);
  }

  @Mutation(() => CoreOutput)
  likeComment(
    @Args('commentId') commentId: number,
    @Args('isIncrement') isIncrement: boolean,
  ) {
    return this.commentService.likeComment(commentId, isIncrement);
  }

  @Mutation(() => CoreOutput)
  dislikeComment(
    @Args('commentId') commentId: number,
    @Args('isIncrement') isIncrement: boolean,
  ) {
    return this.commentService.dislikeComment(commentId, isIncrement);
  }

  @Mutation(() => CoreOutput)
  likeReply(
    @Args('replyId') replyId: number,
    @Args('isIncrement') isIncrement: boolean,
  ) {
    return this.commentService.likeReply(replyId, isIncrement);
  }

  @Mutation(() => CoreOutput)
  dislikeReply(
    @Args('replyId') replyId: number,
    @Args('isIncrement') isIncrement: boolean,
  ) {
    return this.commentService.dislikeReply(replyId, isIncrement);
  }

  @Query(() => [Video])
  getAllVideos() {
    return this.commentService.getAllVideos();
  }

  @Query(() => [Comment])
  getCommentsByVideoUrl(@Args('videoUrl') videoUrl: string) {
    return this.commentService.getCommentsByVideoUrl(videoUrl);
  }

  @Query(() => [CommentReply])
  getRepliesByCommentId(@Args('commentId') commentId: number) {
    return this.commentService.getRepliesByCommentId(commentId);
  }
}
