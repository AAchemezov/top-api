import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { ITelegramModuleOptionAsync } from './telegram.interface'
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants'

@Global()
@Module({})
export class TelegramModule {
	static forRootAsync(options: ITelegramModuleOptionAsync): DynamicModule {
		const asyncOption = this.createAsyncOptionsProvider(options)
		return {
			module: TelegramModule,
			imports: options.imports,
			providers: [TelegramService, asyncOption],
			exports: [TelegramService],
		}
	}

	private static createAsyncOptionsProvider(
		options: ITelegramModuleOptionAsync,
	): Provider {
		return {
			provide: TELEGRAM_MODULE_OPTIONS,
			useFactory: async (...args: any[]) => {
				return options.useFactory(...args)
			},
			inject: options.inject || [],
		}
	}
}
