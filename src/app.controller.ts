import {
  Controller,
  Get,
} from '@nestjs/common'
import { Public } from './common/public.decorator'

@Controller()
export class AppController {

  @Get()
  @Public()
  getHello(): string {
    return 'Hello World!'
  }

}
