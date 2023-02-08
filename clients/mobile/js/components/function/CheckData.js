export const CheckDataLoading = (allData) => {
    const isLoading = allData.some(
        data => data.loading === true || 
                data.success === false)
    return isLoading;
};

export const CheckDataError = (allError) => {
    const hasError = allError.some(error => error !== null)
    return hasError;
};