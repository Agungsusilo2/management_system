
import { CPLProdi, Aspek } from '../../generated/prisma';

export type CPLProdiResponse = {
    kodeCPL: string;
    deskripsiCPL?: string | null;
    kodeAspek?: string | null;
    aspek?: {
        kodeAspek: string;
        namaAspek?: string | null;
    } | null;
};

export type CreateCPLProdiRequest = {
    kodeCPL: string;
    deskripsiCPL: string;
    kodeAspek?: string;
};

export type UpdateCPLProdiRequest = {
    deskripsiCPL?: string;
    kodeAspek?: string;
};

export type SearchCPLProdiRequest = {
    deskripsiCPL?: string;
    kodeAspek?: string;
    page?: number;
    size?: number;
};

export function toCPLProdiResponse(cplProdi: CPLProdi & { aspek?: Aspek | null }): CPLProdiResponse {
    return {
        kodeCPL: cplProdi.KodeCPL,
        deskripsiCPL: cplProdi.DeskripsiCPL,
        kodeAspek: cplProdi.KodeAspek,
        aspek: cplProdi.aspek ? {
            kodeAspek: cplProdi.aspek.KodeAspek,
            namaAspek: cplProdi.aspek.Aspek,
        } : null,
    };
}