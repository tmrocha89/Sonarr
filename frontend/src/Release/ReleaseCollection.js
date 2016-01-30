var PagableCollection = require('backbone.paginator');
var ReleaseModel = require('./ReleaseModel');
var AsSortedCollection = require('Mixins/AsSortedCollection');

var Collection = PagableCollection.extend({
  url: window.Sonarr.ApiRoot + '/release',
  model: ReleaseModel,

  state: {
    pageSize: 2000,
    sortKey: 'download',
    order: -1
  },

  mode: 'client',

  sortMappings: {
    'quality': {
      sortKey: 'qualityWeight'
    },
    'rejections': {
      sortValue(model) {
        var rejections = model.get('rejections');
        var releaseWeight = model.get('releaseWeight');

        if (rejections.length !== 0) {
          return releaseWeight + 1000000;
        }

        return releaseWeight;
      }
    },
    'download': {
      sortKey: 'releaseWeight'
    },
    'seeders': {
      sortValue(model) {
        var seeders = model.get('seeders') || 0;
        var leechers = model.get('leechers') || 0;

        return seeders * 1000000 + leechers;
      }
    },
    'age': {
      sortKey: 'ageMinutes'
    }
  },

  fetchEpisodeReleases(episodeId) {
    return this.fetch({ data: { episodeId: episodeId } });
  }
});

Collection = AsSortedCollection.call(Collection);

module.exports = Collection;