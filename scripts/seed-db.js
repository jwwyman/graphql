const arc = require("@architect/functions");
const { DB_MAP } = require("../src/http/post-graphql/db-schema");

const teams = [
    {
        pk: "T#t_01",
        sk: "#",
        gsi1pk: "Team",
        gsi1sk: "Team One",
        tn: "Team One",
        _tp: "Team",
    },
];
const users = [
    {
        pk: "U#u_01",
        sk: "#",
        gsi1pk: "User",
        gsi1sk: "John Smith",
        gsi2pk: "T#t_01",
        gsi2sk: "#",
        un: "John Smith",
        _tp: "User",
    },
    {
        pk: "U#u_02",
        sk: "#",
        gsi1pk: "User",
        gsi1sk: "Jane Doe",
        gsi2pk: "T#t_01",
        gsi2sk: "#",
        un: "Jane Doe",
        _tp: "User",
    },
    {
        pk: "U#u_03",
        sk: "#",
        gsi1pk: "User",
        gsi1sk: "John Doe",
        gsi2pk: "T#t_01",
        gsi2sk: "#",
        un: "John Doe",
        _tp: "User",
    },
    {
        pk: "U#u_04",
        sk: "#",
        gsi1pk: "User",
        gsi1sk: "Jane Smith",
        gsi2pk: "T#t_01",
        gsi2sk: "#",
        un: "Jane Smith",
        _tp: "User",
    },
];
const certifications = [
    {
        pk: "C#c_01",
        sk: "#",
        gsi1pk: "Certification",
        gsi1sk: "Rock Certification",
        cn: "Rock Certification",
        _tp: "Certification",
    },
    {
        pk: "C#c_02",
        sk: "#",
        gsi1pk: "Certification",
        gsi1sk: "Hiking Certification",
        cn: "Hiking Certification",
        _tp: "Certification",
    },
];
const credentials = [
    {
        pk: "U#u_01",
        sk: "C#c_01",
        gsi1pk: "C#c_01",
        gsi1sk: "U#u_01",
        cn: "Rock Certification",
        un: "John Smith",
        exp: "June,2021",
        _tp: "Credential",
    },
    {
        pk: "U#u_01",
        sk: "C#c_02",
        gsi1pk: "C#c_02",
        gsi1sk: "U#u_01",
        cn: "Hiking Certification",
        un: "John Smith",
        exp: "April,2022",
        _tp: "Credential",
    },
];

const sites = [
    {
        pk: "S#s_01",
        sk: "#",
        gsi1pk: "Site",
        gsi1sk: "Ann Arbor, MI",
        sn: "Ann Arbor, MI",
        _tp: "Site",
    },
    {
        pk: "S#s_02",
        sk: "#",
        gsi1pk: "Site",
        gsi1sk: "Arlington, TX",
        sn: "Arlington, TX",
        _tp: "Site",
    }, 
];

const routes = [
    {
        pk: "R#r_01",
        sk: "#",
        gsi1pk: "Route",
        gsi1sk: "Downtown",
        gsi2pk: "S#s_01",
        gsi2sk: "#",
        rn: "Downtown",
        rd: "up up down down 3",
        path: "{\"name\":\"Error\"}",
        _tp: "Route",
    },
    {
        pk: "R#r_02",
        sk: "#",
        gsi1pk: "Route",
        gsi1sk: "The Mall",
        gsi2pk: "S#s_01",
        gsi2sk: "#",
        rn: "The Mall",
        rd: "{\"name\":\"Error\"}",
        _tp: "Route",
    },    
    {
        pk: "R#r_03",
        sk: "#",
        gsi1pk: "Route",
        gsi1sk: "Over yonder",
        gsi2pk: "S#s_02",
        gsi2sk: "#",
        rn: "Over yonder",
        rd: "up up down down",
        _tp: "Route",
    },
]

async function seedDb() {
    const data = await arc.tables();

    return Promise.all(
        [...teams, ...users, ...certifications, ...credentials, ...sites, ...routes].map((item) => data.singletable.put(item))
    );
}

seedDb()
    .then(() => console.log("local database seeded"))
    .catch((err) => console.log("error:" + err.message));
