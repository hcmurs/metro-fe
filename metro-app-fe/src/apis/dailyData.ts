import axios, { type AxiosResponse } from "axios"
import type { AnalyticsReport } from "../types/data.type"

export const DataFetchAPI = {
    getDaily: async (): Promise<AnalyticsReport[]> => {
        try {
            const result: AxiosResponse<AnalyticsReport[]> = await axios
                .get('http://localhost:8080/admin/get-data')
            console.log('Carousel fetch', result.data)
            return result.data
        } catch (error) {
            console.log('error', error)
            throw error;
        }
    }

}   