import { gql } from "graphql-request";

export const mediaFieldsByType = gql`
fragment mediaFieldsByType on Media {
  ... on ExternalVideo {
    id
    embeddedUrl
  }
  ... on MediaImage {
    image {
      url
    }
  }
  ... on Model3d {
    sources {
      url
      mimeType
      format
      filesize
    }
  }
  ... on Video {
    sources {
      url
      mimeType
      format
      height
      width
    }
  }
}
`;
// ...mediaFieldsByType
