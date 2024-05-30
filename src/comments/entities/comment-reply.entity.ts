import { Entity, Column, ManyToOne } from 'typeorm';
import { Comment } from './comment.entity';
import { CommentCore } from './comment-core.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class CommentReply extends CommentCore {
  @Column()
  @Field(() => Comment)
  @ManyToOne(() => Comment, (comment) => comment.replies)
  comment: Comment;
}
