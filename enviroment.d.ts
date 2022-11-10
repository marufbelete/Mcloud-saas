declare global {
namespace NodeJS {
    interface ProcessEnv {
        PORT:number,
        SECRET:string,
        EMAIL:string,
        CLIENT_ID:string,
        CLIENT_SECRET:string,
        REDIRECT_URI:string,
        REFRESH_TOKEN:string,
        FB_CLIENT_ID:string,
        FB_CLIENT_SECRET:string,
        FB_CALLBACK_URL:string,
    }
  }
}
export {}