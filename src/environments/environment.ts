// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiKey:'https://zipzapzwoop-storage115812-dev.s3.ap-south-1.amazonaws.com/public/res/',
  downloadUrl:"http://streamer-dev.us-east-1.elasticbeanstalk.com/download",
  emailApi:"https://bm5y6mgjxd24vpyvtqmihuflva0uvdbh.lambda-url.ap-south-1.on.aws/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
