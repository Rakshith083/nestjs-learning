import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

function normalizeStackLines(stack: string): string[] {
    return stack
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => !line.startsWith('Error:'));
}

export function formatStack(error: unknown): string {
    if (!(error instanceof Error)) {
        return 'Unknown error';
    }

    const stack = error.stack ?? '';
    if (!stack) {
        return 'No stack trace available';
    }

    const lines = normalizeStackLines(stack)
        .map((line) => line.replace(/^at\s+/i, ''))
        .filter((line) => {
            const isNodeFrame = /node_modules|node:internal|internal\//i.test(line);
            return !isNodeFrame && /\(.+\:\d+:\d+\)$|\w+\s+.*:\d+:\d+$/.test(line);
        })
        .slice(0, 5);

    return lines.join('\n') || normalizeStackLines(stack).slice(0, 5).join('\n') || stack;
}

export function getErrorOrigin(error: unknown): string {
    if (!(error instanceof Error)) {
        return 'Unknown origin';
    }

    const stack = error.stack ?? '';
    if (!stack) {
        return 'Unknown origin';
    }

    let fallback = 'Unknown origin';

    for (const line of normalizeStackLines(stack)) {
        const cleanedLine = line.replace(/^at\s+/i, '');

        const match = cleanedLine.match(/^(.*?)\s+\((.*:\d+:\d+)\)$/) ?? cleanedLine.match(/^(.*?)(\S+:\d+:\d+)$/);
        if (!match) {
            continue;
        }

        const method = match[1]?.trim() || 'Unknown';
        const location = match[2]?.trim() || 'unknown location';
        const candidate = `${method} (${location})`;

        if (!/node_modules|node:internal|internal\//i.test(cleanedLine)) {
            return candidate;
        }

        if (fallback === 'Unknown origin') {
            fallback = candidate;
        }
    }

    return fallback;
}

function inferControllerNameFromRequest(request: Request): string {
    const rawPath = request.originalUrl ?? request.url ?? '';
    const segments = rawPath.split('/').filter(Boolean).filter((segment) => segment !== 'api');

    if (segments.length === 0) {
        return 'UnknownController';
    }

    const controllerSegment = segments.find((segment) => !['create', 'createBulk', 'update', 'delete', 'patch', 'get', 'all'].includes(segment));
    if (!controllerSegment) {
        return 'UnknownController';
    }

    const controllerName = `${controllerSegment.charAt(0).toUpperCase()}${controllerSegment.slice(1)}Controller`;
    return controllerName;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse =
            exception instanceof HttpException ? exception.getResponse() : { message: 'Internal server error' };

        const message =
            typeof errorResponse === 'string'
                ? errorResponse
                : (errorResponse as { message?: string })?.message ?? 'Internal server error';

        const executionContext = host as ExecutionContext;
        const stack = formatStack(exception);
        const origin = getErrorOrigin(exception);

        const controllerName =
            executionContext.getClass?.()?.name ??
            inferControllerNameFromRequest(request) ??
            'UnknownController';

        const methodName =
            executionContext.getHandler?.()?.name ??
            (origin.includes('ValidationPipe') ? 'exceptionFactory' : request.method.toLowerCase()) ??
            'unknownMethod';

        this.logger.error(
            `${request.method} ${request.originalUrl ?? request.url} - ${message} | controller=${controllerName} | method=${methodName} | origin=${origin}`,
            stack,
            GlobalExceptionFilter.name,
        );

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}
