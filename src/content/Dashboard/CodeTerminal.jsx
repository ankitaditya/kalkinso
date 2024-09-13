
import React, { useEffect, useState } from 'react';
import { Terminal } from 'primereact/terminal';
import { TerminalService } from 'primereact/terminalservice';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

export default function CodeTerminal() {
    const [prompt, setPrompt] = useState('~/kalkinso/project/adykits $');
    const commandHandler = (text) => {
        let response;
        let argsIndex = text.indexOf(' ');
        let command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;

        switch (command) {
            case 'date':
                response = 'Today is ' + new Date().toDateString();
                break;

            case 'greet':
                response = 'Hola ' + text.substring(argsIndex + 1) + '!';
                break;

            case 'random':
                response = Math.floor(Math.random() * 100);
                break;

            case 'python':
                response = `Python 3.8.5 (${new Date().toDateString()}) \n[GCC 7.3.0] on linux`;
                setPrompt('>>>');
                break;

            case 'clear':
                response = null;
                setPrompt('~/kalkinso/project/adykits $');
                break;

            default:
                if(prompt === '>>>'){
                    switch (command) {
                        case 'exit':
                            response = 'Exiting Python';
                            setPrompt('~/kalkinso/project/adykits $');
                            break;
                        default:
                            response = 'Invalid Syntax: ' + command;
                            break;
                    }
                } else {
                    response = 'Unknown command: ' + command;
                }
                break;
        }

        if (response)
            TerminalService.emit('response', response);
        else
            TerminalService.emit('clear');
    };

    useEffect(() => {
        TerminalService.on('command', commandHandler);

        return () => {
            TerminalService.off('command', commandHandler);
        };
    }, []);

    return (
        <Terminal 
            prompt={prompt}
            style={{ height: '20vh', width: '100%' }}
            pt={{
                root: 'bg-gray-900 text-white border-round',
                prompt: 'text-gray-400 mr-2',
                command: 'text-primary-300',
                response: 'text-primary-300'
            }} 
        />
    );
}
        