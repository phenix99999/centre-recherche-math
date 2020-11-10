import Client from '../Client';

const client = new Client('mapassistance.com', 'MapAssistance', () => 'Basic QWxhaW4gU2ltb25lYXU6NDI1MQ==')
it(`filemaker request`, async () => {
});


it(`full text query`, async () => {

    await client.customQuery('Xojo_DOSSIERS', { "Defunt_Nom": ["Bara"] })
        .then(resp => {
            //const fields = resp.records.map(record => record.fields)
        })
});