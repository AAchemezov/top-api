import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { CreateReviewDto } from './dto/create-review.dto'
import { ReviewService } from './review.service'
import { REVIEW_NOT_FOUND } from './review.constants'
import { JwtGuard } from '../auth/guards/jwt.guard'
import { IdValidationPipe } from '../pipes/id-validation.pipe'
import { TelegramService } from '../telegram/telegram.service'

@Controller('review')
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly telegramService: TelegramService,
	) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@Post('notify')
	async notify(@Body() dto: CreateReviewDto) {
		const message =
			`Имя: ${dto.name}\n` +
			`Заголовок: ${dto.name}\n` +
			`Описание: ${dto.name}\n` +
			`Рейтинг: ${dto.name}\n` +
			`ID продукта: ${dto.name}`
		return this.telegramService.sendMessage(message)
	}

	@UseGuards(JwtGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.reviewService.delete(id)
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND)
		}
	}

	@Get('byProduct/:productId')
	async getByProduct(
		@Param('productId', IdValidationPipe) productId: string,
	) {
		return this.reviewService.findByProductId(productId)
	}
}
