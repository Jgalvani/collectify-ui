const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
    console.log('error: argument "path" is missing');
    console.log('usage: update_page_modules.js <path>');
    process.exit();
}

// Variables
const pagePath = path.join('src/app', process.argv[2]);
const splitRoutingDelimiter = '// Not found module should always be last to avoid conflict with other modules.';

// Names
const name = path.basename(pagePath);
let capitalName = '';
name.split('-').forEach(n => capitalName += n[0].toUpperCase() + n.slice(1))

// Paths
const appRoutingPath = path.join('src/app/app-routing.module.ts');
const modulePath = path.join(pagePath, `${name}.module.ts`);
const routingPath = path.join(pagePath, `${name}-routing.module.ts`);

// Contents
const routingContent = `import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ${capitalName}Component } from './${name}.component'

const routes: Routes = [
    {
        path: '',
        component: ${capitalName}Component,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ${capitalName}RoutingModule {}
`;

const moduleContent = `import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'src/app/shared.module'
import { ${capitalName}RoutingModule } from './${name}-routing.module'
import { ${capitalName}Component } from './${name}.component'

@NgModule({
    declarations: [${capitalName}Component],
    imports: [CommonModule, ${capitalName}RoutingModule, SharedModule],
})
export class ${capitalName}Module {}
`;

// Create and update files
fs.appendFile(routingPath, routingContent, function (err) {
    if (err) throw err;
    console.log(`${routingPath} was created`);
});

fs.writeFile(modulePath, moduleContent, function (err) {
    if (err) throw err;
    console.log(`${modulePath} was updated`);
});

fs.readFile(appRoutingPath, function (err, file) {
    if (err) throw err;
    const routing = file.toString();
    let start = routing.split(splitRoutingDelimiter)[0];
    start += `{
        path: '${name}',
        loadChildren: () =>
            import('./pages/${name}/${name}.module').then((m) => m.${capitalName}Module),
    },
    `;
    const newRouting = [start, routing.split(splitRoutingDelimiter)[1]].join(splitRoutingDelimiter);

    fs.writeFile(appRoutingPath, newRouting, function (err) {
        if (err) throw err;
        console.log(`${appRoutingPath + '.module.ts'} was updated`);
    });
});

