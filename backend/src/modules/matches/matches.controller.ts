import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MatchesService } from './matches.service';

@ApiTags('مچ‌ها (Matches)')
@Controller('matches')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get()
  @ApiOperation({ summary: 'مچ‌های من' })
  async getMyMatches(@Req() req: any) {
    return this.matchesService.getMyMatches(req.user.id);
  }
}
