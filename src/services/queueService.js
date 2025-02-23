const EventEmitter = require('events');

class ImageProcessingQueue extends EventEmitter {
    constructor() {
        super();
        this.queue = [];
        this.processing = false;
    }

    async addJob(data) {
        const job = {
            id: Date.now().toString(),
            data,
            status: 'pending',
            timestamp: new Date()
        };
        this.queue.push(job);
        this.emit('jobAdded', job);
        this.processQueue();
        return job.id;
    }

    getJobStatus(jobId) {
        const job = this.queue.find(job => job.id === jobId);
        return job ? job.status : null;
    }

    async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        const job = this.queue[0];
        
        try {
            job.status = 'processing';
            this.emit('processingStarted', job);
            await this.processJob(job);
            job.status = 'completed';
            this.emit('processingCompleted', job);
        } catch (error) {
            job.status = 'failed';
            job.error = error.message;
            this.emit('processingFailed', job);
        }
        
        this.processing = false;
        this.queue.shift();
        this.processQueue();
    }

    async processJob(job) {
        this.emit('progress', { jobId: job.id, progress: 0 });
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.emit('progress', { jobId: job.id, progress: 100 });
    }
}

module.exports = new ImageProcessingQueue();