import * as bcrypt from 'bcrypt';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@ObjectType()
@Entity()
export class CommentCore extends CoreEntity {
  @Column()
  @Field(() => String)
  @MaxLength(20, { message: '닉네임은 20자 이내로 입력해주세요.' })
  @MinLength(1, { message: '닉네임은 2글자 이상으로 입력해주세요' })
  nickname: string;

  @Column({ select: false })
  @Field(() => String)
  password: string;

  @Column()
  @Field(() => String)
  @MaxLength(5000, { message: '댓글 내용은 5000자 이내로 입력해주세요.' })
  @MinLength(1, { message: '댓글 내용은 2글자 이상으로 입력해주세요' })
  content: string;

  @Column({ default: 0 })
  @Field(() => Number)
  likes: number;

  @Column({ default: 0 })
  @Field(() => Number)
  dislikes: number;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;

    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(password: string) {
    try {
      const ok = await bcrypt.compare(password, this.password);

      return ok;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
