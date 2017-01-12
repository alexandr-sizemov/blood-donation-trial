
      declare var System: any;

      const deps = [
        'esri/Map',
        'esri/views/MapView',
        'esri/widgets/Home/HomeViewModel'
        ];
      const moduleName = (name) => name.match(/[^\/]+$/).shift();

      function register(name: string, mods: any[]) {
        System.register(name, [], exp => {
          return {
            setters: [],
            execute: () => {
              mods.map((mod: any, idx: number) => {
                exp(moduleName(deps[idx]), mod);
              });
            }
          }
        });
      }


      System.config({
        baseURL: '/node_modules',
        defaultJSExtensions: true,
        warnings: true,
        packages: {'app': {format: 'register', defaultExtension: 'js'}} 
      });
      
      require(deps, function(...modules) {
        register('esri-mods', modules);
        System.import('app/boot')
          .then(null, console.error.bind(console));
      });