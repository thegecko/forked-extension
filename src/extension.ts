import { Service } from './service';

let service: Service;

export const activate = async (): Promise<void> => {
    service = new Service();
    await service.activate();
};

export const deactivate = async (): Promise<void> => {
    if (service) {
        await service.deactivate();
    }
};
