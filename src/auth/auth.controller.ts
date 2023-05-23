import { FileService } from './../file/file.service';
import { AuthService } from './auth.service';
import { Body, Controller, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) {}

  @Post('login')
  async login(@Body() {email, password}: AuthLoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() {email}: AuthForgetDTO) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() {password, token}: AuthResetDTO) {
    return this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User('email') user) {

    return {user};
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(@User() user, @UploadedFile() photo: Express.Multer.File) {
    const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.png`);

    return this.fileService.upload(photo, path);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {

    return files;
  }

  @UseInterceptors(FileFieldsInterceptor([{
    name: 'photo',
    maxCount: 1
  },
  {
    name: 'documents',
    maxCount: 2,
  }]))
  @UseGuards(AuthGuard)
  @Post('files-fields')
  async uploadFilesFields(@User() user, @UploadedFiles() files: {photo: Express.Multer.File, documents: Express.Multer.File[]}) {

    return files;
  }
}
