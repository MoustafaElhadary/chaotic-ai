import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('ai-manager')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Post('start')
  // startAiManager(
  //   @Body() params: z.infer<typeof this.appService.aiManagerSchema>,
  // ) {
  //   const sessionId = this.appService.startAiManager(params);
  //   return { sessionId };
  // }

  // @Sse('stream/:sessionId')
  // aiManagerStream(
  //   @Param('sessionId') sessionId: string,
  // ): Observable<MessageEvent> {
  //   return this.appService
  //     .aiManagerStream(sessionId)
  //     .pipe(map((data) => ({ data }) as MessageEvent));
  // }

  // @Post('stop/:sessionId')
  // async stopAiManager(@Param('sessionId') sessionId: string): Promise<void> {
  //   await this.appService.stopAiManager(sessionId);
  // }

  @Get('hello')
  async hello() {
    return 'Hello, world!';
  }
}
