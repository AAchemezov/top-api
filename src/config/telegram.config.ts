import { ITelegramOptions } from '../telegram/telegram.interface'
import { ConfigService } from '@nestjs/config'

export const getTelegramConfig = (
	configService: ConfigService,
): ITelegramOptions => {
	const token = configService.get('TELEGRAM_TOKEN')
	const chatId = configService.get('TELEGRAM_CHAT_ID') ?? ''
	if (!token) {
		throw new Error('TELEGRAM_TOKEN не задан')
	}
	return {
		chatId,
		token,
	}
}
