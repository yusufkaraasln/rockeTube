import { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

chai.use(chaiHttp);


describe('GET /api', () => {
    it('should return 200 OK', () => {
        return chai
            .request(app)
            .get('/api')
            .then((res) => {
                expect(res.status).to.equal(200);
            });
    });
});
