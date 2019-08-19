'use strict';
import * as vscode from 'vscode';
import ZigCompilerProvider from './zigCompilerProvider';
import { ZigFormatProvider, ZigRangeFormatProvider } from './zigFormat';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions
} from 'vscode-languageclient';

const ZIG_MODE: vscode.DocumentFilter = { language: 'zig', scheme: 'file' };

export function activate(context: vscode.ExtensionContext) {
    let compiler = new ZigCompilerProvider();
    compiler.activate(context.subscriptions);
    vscode.languages.registerCodeActionsProvider('zig', compiler);

    const zigFormatStatusBar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
    );
    const logChannel = vscode.window.createOutputChannel('zig');
    context.subscriptions.push(logChannel);
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(
            ZIG_MODE,
            new ZigFormatProvider(logChannel),
        ),
    );

    context.subscriptions.push(
        vscode.languages.registerDocumentRangeFormattingEditProvider(
            ZIG_MODE,
            new ZigRangeFormatProvider(logChannel),
        ),
    );

    let serverOptions: ServerOptions = {
        command: "zig-lsp", args: []
    };

    let clientOptions: LanguageClientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: 'file', language: 'zig' }]
    };

    const zigClient = new LanguageClient(
        'zig-lsp',
        'Zig Language Server',
        serverOptions,
        clientOptions
    );

    context.subscriptions.push(zigClient.start());
}

export function deactivate() {
}
