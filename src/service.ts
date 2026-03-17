/**
 * Copyright (C) 2022 Arm Limited
 */

import * as vscode from 'vscode';
import { join } from 'path';
import { ChildProcess, fork } from 'child_process';

const CHILD_PROCESS = join(__dirname, 'client.js');

export class Service {
    protected process: ChildProcess | undefined;
    protected running = false;

    public async activate(): Promise<void> {
        vscode.window.showInformationMessage('service starting');
        this.startProcess();
    }

    public async deactivate(): Promise<void> {
        if (this.process) {
            vscode.window.showInformationMessage('service stopping');
            this.running = false;
            this.process.kill();
        }
    }

    protected startProcess() {
        this.process = fork(CHILD_PROCESS);
        if (!this.process) {
            vscode.window.showInformationMessage('Failed to start service');
            return;
        }

        this.running = true;
        this.process.once('close', code => {
            vscode.window.showInformationMessage(`closed with ${code}`)
            if (this.running) {
                vscode.window.showInformationMessage('service restarting');
                setTimeout(() => this.startProcess(), 0);
            }
        });

        vscode.window.showInformationMessage('service running');
    }
}
