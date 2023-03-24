export interface kAuthRequest extends Request {
    kauth: { grant: { [key: string]: unknown } }
}
