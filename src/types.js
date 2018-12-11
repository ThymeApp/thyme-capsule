// @flow
import type { $Request } from 'express';

export type ThymeRequest = {
  body: { [key: string]: any };
  user?: {
    id: string;
    email: string;
    password: string;
    premium: boolean;
    update: (updates: any) => any;
  };
} & $Request;

export type ThymeCapability = 'premium' | 'project_rates' | 'insights';
export type ThymeCapabilities = ThymeCapability[];
