import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class CommonService {
  private readonly logger = new Logger('CommonService');

  handleDBExceptions(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(
        `The username ${error.keyValue.username} already exists, try another one.`,
      );
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Check server logs');
  }
}
