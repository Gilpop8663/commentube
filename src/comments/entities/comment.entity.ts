import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommentReply } from './comment-reply.entity';
import { CommentCore } from './comment-core.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Video } from './video.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CommentCore {
  @Column()
  @Field(() => [CommentReply])
  @OneToMany(() => CommentReply, (reply) => reply)
  replies: CommentReply[];

  @Column()
  @Field(() => Video)
  @ManyToOne(() => Video, (video) => video.comments)
  video: Video;
}
