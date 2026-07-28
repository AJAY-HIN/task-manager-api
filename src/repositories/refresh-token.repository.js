const { RefreshToken } = require('../models');

class RefreshTokenRepository {
  async create(data) {
    return RefreshToken.create(data);
  }

  async findByHash(tokenHash) {
    return RefreshToken.findOne({
      where: {
        tokenHash,

        revoked: false,
      },
    });
  }

  async revoke(id) {
    return RefreshToken.update(
      {
        revoked: true,
      },

      {
        where: {
          id,
        },
      }
    );
  }
}

module.exports = new RefreshTokenRepository();
