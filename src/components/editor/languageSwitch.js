import React from 'react';
import { Link } from 'react-router'

import TranslationStore from '../../stores/translation';

export default class LanguageSwitch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      language: TranslationStore.language,
      languages: TranslationStore.languages
    };
  }

  switchLanguage(languageCode) {
    window.location.href = '#/' + languageCode + '/tool';
    window.location.reload();
  }

  render() {
    let that = this;
    return(
      <ul className="languageSwitch">
        {this.state.languages.filter((l) => l.code != that.state.language).map(function(l) {
          return (
            <li key={ l.code }>
              <Link to={"/" + l.code + "/tool"} onClick={ () => that.switchLanguage(l.code) }>
                <img src={ l.flag } />
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }
}
