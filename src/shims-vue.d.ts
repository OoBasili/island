declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module '*.vs' {
  const content: string;

  export default content;
}

declare module '*.fs' {
  const content: string;
  
  export default content;
}

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
