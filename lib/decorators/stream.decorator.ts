import { SetMetadata } from '@nestjs/common';
import { STREAM_METADATA_KEY } from '../constants';

export const Stream = (streamName: string) => SetMetadata(STREAM_METADATA_KEY, streamName);