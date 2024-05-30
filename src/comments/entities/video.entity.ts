import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Video extends CoreEntity {
  @Column({ default: 0 })
  @Field(() => Number)
  likes: number;

  @Column({ default: 0 })
  @Field(() => Number)
  dislikes: number;

  @Column()
  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment)
  comments: Comment[];
}
