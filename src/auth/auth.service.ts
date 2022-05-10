import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UserModel } from './user.model'
import { InjectModel } from 'nestjs-typegoose'
import { compare, genSalt, hash } from 'bcryptjs'
import {
	INCORRECT_PASSWORD_ERROR,
	USER_NOT_FOUND_ERROR,
} from './auth.constants'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel)
		private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async createUser(dto: AuthDto) {
		const salt = await genSalt(10)
		const newUser = new this.userModel({
			email: dto.login,
			passwordHash: await hash(dto.password, salt),
		})

		return newUser.save()
	}

	async findUser(email: string) {
		return this.userModel.findOne({ email }).exec()
	}

	async validateUser(
		email: string,
		password: string,
	): Promise<Pick<UserModel, 'email'>> {
		const user = await this.findUser(email)
		if (!user) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR)
		}
		const isCorrectUserPassword = await compare(password, user.passwordHash)
		if (!isCorrectUserPassword) {
			throw new BadRequestException(INCORRECT_PASSWORD_ERROR)
		}
		return { email: user.email }
	}

	async login(email: string) {
		const payLoad = { email }
		return {
			access_token: await this.jwtService.signAsync(payLoad),
		}
	}
}
