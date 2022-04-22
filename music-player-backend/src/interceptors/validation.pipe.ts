import { ArgumentMetadata, BadRequestException, ValidationPipe } from "@nestjs/common";

export class ValidationPipeCheck extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        const response: any = e.getResponse();
        if (typeof response === "string") throw new BadRequestException(response);
        throw new BadRequestException(response.message[0]);
      }
    }
  }
}
