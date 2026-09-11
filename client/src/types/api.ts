export type ApiSuccess<T> = {
    success : true;
    data : T;
}

export type ApiFailure  = {
    success : false,
    error : string | Record<string,unknown>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;