const { DB_MAP } = require("./db-schema");
var DomParser = require('dom-parser');

const resolverMap = {
    Query: {
        team: (root, args, ctx, info) => {
            return ctx.db.singletable.get(DB_MAP.TEAM.get({ teamId: args.id })).then((data) => DB_MAP.TEAM.parse(data));
        },
        teamByName: (root, args, ctx, info) => {
            return ctx.db.singletable
                .query(DB_MAP.TEAM.queryByName({ teamName: args.name }))
                .then((data) => DB_MAP.parseList(data, "TEAM"));
        },
        user: (root, args, ctx, info) => {
            return ctx.db.singletable.get(DB_MAP.USER.get({ userId: args.id })).then((data) => DB_MAP.USER.parse(data));
        },
        userByName: (root, args, ctx, info) => {
            return ctx.db.singletable
                .query(DB_MAP.USER.queryByName({ userName: args.name }))
                .then((data) => DB_MAP.parseList(data, "USER"));
        },
        certification: (root, args, ctx, info) => {
            return ctx.db.singletable
                .get(DB_MAP.CERTIFICATION.get({ certificationId: args.id }))
                .then((data) => DB_MAP.CERTIFICATION.parse(data));
        },
        certificationByName: (root, args, ctx, info) => {
            return ctx.db.singletable
                .query(DB_MAP.CERTIFICATION.queryByName({ certificationName: args.name }))
                .then((data) => {
                    console.log(data);
                    return DB_MAP.parseList(data, "CERTIFICATION");
                });
        },
        allTeams: (root, args, ctx, info) => {
            return ctx.db.singletable.query(DB_MAP.TEAM.queryAll).then((data) => DB_MAP.parseList(data, "TEAM"));
        },
        allCertifications: (root, args, ctx, info) => {
            return ctx.db.singletable
                .query(DB_MAP.CERTIFICATION.queryAll)
                .then((data) => DB_MAP.parseList(data, "CERTIFICATION"));
        },
        allUsers: (root, args, ctx, info) => {
            return ctx.db.singletable.query(DB_MAP.USER.queryAll).then((data) => DB_MAP.parseList(data, "USER"));
        },
        site: (root, args, ctx, info) => {
            return ctx.db.singletable.get(DB_MAP.SITE.get({ siteId: args.id })).then((data) => DB_MAP.SITE.parse(data));
        },
        allSites: (root, args, ctx, info) => {
            return ctx.db.singletable.query(DB_MAP.SITE.queryAll).then((data) => DB_MAP.parseList(data, "SITE"));
        },
        route: (root, args, ctx, info) => {
            return ctx.db.singletable.get(DB_MAP.ROUTE.get({ routeId: args.routeId })).then((data) => DB_MAP.ROUTE.parse(data));
        },        
        routeBySite: (root, args, ctx, info) => {
            return ctx.db.singletable.queryBySiteId(DB_MAP.ROUTE.get({ siteId: args.routeId })).then((data) => DB_MAP.ROUTE.parse(data));
        },
        allRoutes: (root, args, ctx, info) => {
//            ctx.db.singletable.query(DB_MAP.ROUTE.queryAll).then((data) => console.log(data));

            //ctx.db.singletable.query(DB_MAP.ROUTE.queryAll).then(console.log(data));
            return ctx.db.singletable.query(DB_MAP.ROUTE.queryAll).then((data) => DB_MAP.parseList(data, "ROUTE"));
        },
    },
    Mutation: {
        createRoute: (root, args, ctx, info) => {
             // using togeojson in nodejs
            var tj = require('@mapbox/togeojson');
            
            // node doesn't have xml parsing or a dom. use xmldom
            var DOMParser = require('xmldom').DOMParser;
            var kml = (new DOMParser()).parseFromString(args.input.pathXML, 'text/xml');

            var convertedWithStyles = tj.kml(kml, { styles: true });            
            
            p = DB_MAP.ROUTE.put({
                routeId: args.input.routeId, 
                routeName: args.input.routeName,
                siteId: args.input.siteId,
                pathXML: args.input.pathXML,
                pathJSON: convertedWithStyles 
            });
//            console.log(p);
            ctx.db.singletable.put(p);
            return ctx.db.singletable.get(DB_MAP.ROUTE.get({ routeId: args.input.routeId })).then((data) => DB_MAP.ROUTE.parse(data));

//            return .then((data) => DB_MAP.SITE.parse(data));
        },
            
        createSite: (root, args, ctx, info) => {

            return ctx.db.singletable.put(DB_MAP.SITE.put({siteId: args.input.siteId, siteName: args.input.siteName}))
                .then((data) => DB_MAP.SITE.parse(data));
        }
    },
    Team: {
        name: (root, _, ctx) => {
            if (root.name) {
                return root.name;
            } else {
                return ctx.db.singletable
                    .get(DB_MAP.TEAM.get({ teamId: root.id }))
                    .then((data) => DB_MAP.TEAM.parse(data).name);
            }
        },
        members: (root, _, ctx) => {
            return ctx.db.singletable
                .query(DB_MAP.USER.queryByTeamId({ teamId: root.id }))
                .then((data) => DB_MAP.parseList(data, "USER"));
        },
    },
    User: {
        name: (root, _, ctx) => {
            if (root.name) {
                return root.name;
            } else {
                return ctx.db.singletable
                    .get(DB_MAP.USER.get({ userId: root.id }))
                    .then((data) => DB_MAP.USER.parse(data).name);
            }
        },
        credentials: (root, _, ctx) => {
            return ctx.db.singletable
                .query(DB_MAP.CREDENTIAL.queryByUserId({ userId: root.id }))
                .then((data) => DB_MAP.parseList(data, "CREDENTIAL"));
        },
    },
    Site: {
        name: (root, _, ctx) => {
            if (root.name) {
                return root.name;
            } else {
                return ctx.db.singletable
                    .get(DB_MAP.SITE.get({ siteId: root.siteId }))
                    .then((data) => DB_MAP.SITE.parse(data).name);
            }
        },
        routes: (root, _, ctx) => {
            return ctx.db.singletable
                .query(DB_MAP.ROUTE.queryBySiteId({ siteId: root.siteId }))
                .then((data) => DB_MAP.parseList(data, "ROUTE"));
        },
    },
    Route: {
        routeName: (root, _, ctx) => {
            if (root.routeName) {
                return root.routeName;
            } else {
                return ctx.db.singletable
                    .get(DB_MAP.ROUTE.get({ routeId: root.routeId }))
                    .then((data) => DB_MAP.ROUTE.parse(data).routeName);
            }
        },
    },
};

module.exports = { resolverMap };
