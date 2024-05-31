import { Injectable } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentInput } from './dtos/create-comment.dto';
import { Video } from './entities/video.entity';
import { CreateVideoInput } from './dtos/create-video.dto';
import { CommentReply } from './entities/comment-reply.entity';
import { EditCommentInput } from './dtos/edit-comment.dto';
import { DeleteCommentInput } from './dtos/delete-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(CommentReply)
    private commentReplyRepository: Repository<CommentReply>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  async getAllVideos() {
    return this.videoRepository.find({ relations: ['comments'] });
  }

  async getCommentsByVideoUrl(videoUrl: string) {
    const video = await this.videoRepository.findOne({
      where: { videoUrl },
      relations: ['comments', 'comments.replies'],
    });

    if (!video) {
      return { ok: false, error: '비디오가 존재하지 않습니다.' };
    }

    return video.comments;
  }

  async getRepliesByCommentId(commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['replies'],
    });

    if (!comment) {
      return { ok: false, error: '댓글이 존재하지 않습니다.' };
    }

    return comment.replies;
  }

  async createComment(videoUrl: string, commentData: CreateCommentInput) {
    try {
      const video = await this.videoRepository.findOne({ where: { videoUrl } });

      if (!video) {
        return { ok: false, error: '비디오를 찾을 수 없습니다' };
      }

      const newComment = this.commentRepository.create({
        ...commentData,
        video,
      });

      await this.commentRepository.save(newComment);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '댓글 생성에 실패했습니다.' };
    }
  }

  async createVideo(videoData: CreateVideoInput) {
    try {
      const extractVideoId = (url: string) => {
        const pattern =
          /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(pattern);
        return match ? match[1] : null;
      };

      const videoUrl = extractVideoId(videoData.videoUrl);

      if (!videoData) {
        return { ok: false, error: '유효하지 않은 URL입니다.' };
      }

      const newVideo = this.videoRepository.create({ videoUrl });

      await this.videoRepository.save(newVideo);

      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false, error: '비디오 생성에 실패했습니다.' };
    }
  }

  async createReply(commentId: number, replyData: CreateCommentInput) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });

      if (!comment) {
        return { ok: false, error: '댓글이 존재하지 않습니다.' };
      }

      const newCommentReply = this.commentReplyRepository.create({
        ...replyData,
        comment,
      });

      await this.commentReplyRepository.save(newCommentReply);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '답글 생성에 실패했습니다.' };
    }
  }

  async editComment(
    commentId: number,
    { password, content }: EditCommentInput,
  ) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        select: ['password'],
      });

      if (!comment) {
        return { ok: false, error: '댓글이 존재하지 않습니다.' };
      }

      console.log(password, comment.password);

      const isPasswordCorrect = await comment.checkPassword(password);

      if (!isPasswordCorrect) {
        return { ok: false, error: '비밀번호가 맞지 않습니다.' };
      }

      await this.commentRepository.update(commentId, { content });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '댓글 수정에 실패했습니다.' };
    }
  }

  async deleteComment(commentId: number, { password }: DeleteCommentInput) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        select: ['password'],
      });

      if (!comment) {
        return { ok: false, error: '댓글이 존재하지 않습니다.' };
      }

      const isPasswordCorrect = await comment.checkPassword(password);

      if (!isPasswordCorrect) {
        return { ok: false, error: '비밀번호가 맞지 않습니다.' };
      }

      await this.commentRepository.delete(commentId);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '댓글 삭제에 실패했습니다.' };
    }
  }

  async editReply(replyId: number, { password, content }: EditCommentInput) {
    try {
      const reply = await this.commentReplyRepository.findOne({
        where: { id: replyId },
        select: ['password'],
      });

      if (!reply) {
        return { ok: false, error: '댓글이 존재하지 않습니다.' };
      }

      console.log(password, reply.password);

      const isPasswordCorrect = await reply.checkPassword(password);

      if (!isPasswordCorrect) {
        return { ok: false, error: '비밀번호가 맞지 않습니다.' };
      }

      await this.commentReplyRepository.update(replyId, { content });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '댓글 수정에 실패했습니다.' };
    }
  }

  async deleteReply(replyId: number, { password }: DeleteCommentInput) {
    try {
      const reply = await this.commentReplyRepository.findOne({
        where: { id: replyId },
        select: ['password'],
      });

      if (!reply) {
        return { ok: false, error: '댓글이 존재하지 않습니다.' };
      }

      const isPasswordCorrect = await reply.checkPassword(password);

      if (!isPasswordCorrect) {
        return { ok: false, error: '비밀번호가 맞지 않습니다.' };
      }

      await this.commentReplyRepository.delete(replyId);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '댓글 삭제에 실패했습니다.' };
    }
  }
}
