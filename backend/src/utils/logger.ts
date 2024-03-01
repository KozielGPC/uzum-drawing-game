class Logger {
    public info(message: string) {
        //cyan
        console.log('\x1b[36m%s\x1b[0m', `INFO (${new Date()}): ${message}`);
    }

    public warning(message: string) {
        //yellow
        console.log('\x1b[33m%s\x1b[0m', `WARNING (${new Date()}): ${message}`);
    }

    public error(message: string) {
        //red
        console.log('\x1b[31m%s\x1b[0m', `ERROR (${new Date()}): ${message}`);
    }
}

export const logger = new Logger();
