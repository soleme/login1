import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RequestUser } from '../common/types/request-user.type';
import { UserResponseDto } from '../users/user-response.dto';
import { UsersService } from '../users/users.service';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  findAll() {
    return this.usersService.findAllSafe();
  }

  @Get(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.findSafeById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'User deleted.' })
  @ApiBadRequestResponse({ description: 'Admins cannot delete their own account.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() currentUser: RequestUser) {
    if (id === currentUser.id) {
      throw new BadRequestException('Admins cannot delete their own account.');
    }

    try {
      await this.usersService.deleteById(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('User not found.');
      }

      throw error;
    }
  }
}
