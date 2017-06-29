import React from 'react';
import { Link } from 'react-router'

export default React.createClass({

  render() {
    return(
      <div className="landing-page">
        <header>
          <div className="col">
            <h1>Smart life met <em>CT-3000</em></h1>
            <div className="logos">
              <a href="http://codeuur.nl" className="codeuur"><img src={require('../assets/img/codeuur-logo.png')} alt="Logo CodeUur" /> CodeUur</a>
              <a href="http://blink.nl" className="blink"><img src={require('../assets/img/blink-logo.png')} alt="Logo Blink" /></a>
              <a href="http://q42.nl" className="q42"><img src={require('../assets/img/q42-logo.svg')} alt="Logo Q42" /></a>
            </div>
          </div>
        </header>
        <div className="intro-content">
          <div className="col">
            <article>
              <h2>Programmeer je Smart Life</h2>
              <p>Wil je iets bedenken voor een <span className="color-red">Smart Life</span> of een <span className="color-red">Smart Home</span>? Wil jij bijvoorbeeld dat de <span className="color-blue">muziek</span> aan gaat <span className="color-red">als</span> de zon schijnt? Of moet de <span className="color-blue">radio</span> je wekken als het <span className="color-purple">7.00</span> in de ochtend is, en weer zelf uit gaan als je om <span className="color-purple">8.15</span> naar school gaat? Of wil je een <span className="color-blue">sms</span> ontvangen <span className="color-red">als</span> iemand je <span className="color-blue">voordeur</span> open doet?</p>
              <p>Dan is het handig <span className="color-red">als</span> je kunt <span className="color-blue">programmeren</span>! Met de programmeer-tool <span className="color-purple">CT3000</span> oefen je een aantal belangrijke programmeer-principes, zoals <span className="color-blue">‘IF-THEN’</span>. Dus, bedenk iets slims <span className="color-red">en</span> programmeer het zelf!</p>
              <Link to={'/nl/tool'} className="fat-link"><span>Aan de slag met <em>CT3000</em></span></Link>
            </article>
            <article>
              <h2>Het thema Smart Life</h2>
              <p>De programmeer-tool CT3000 hoort bij het thema Smart Life, over computional thinking en programmeren.
                Het thema is ontwikkeld door uitgeverij <a href="http://blink.nl" className="inline-link">Blink</a>
                , <a href="http://codeuur.nl" className="inline-link">stichting CodeUur</a> en <a href="http://q42.nl" className="inline-link">Q42</a>.</p>
              <p>Het thema Smart Life omvat vijf lessen en is ontwikkeld voor groep 5/6 en
                7/8. Vanuit de lessen wordt verwezen naar de tool. De lessen en de tool
                zijn gratis beschikbaar voor alle scholen.</p>
              <p><i>De lessen zijn gratis beschikbaar via onderstaande de knop. Het thema is
                ook toegankelijk in de lesomgeving van Blink: <a href="http://www.blink-studio.nl/" className="inline-link">Blink Studio</a>.</i></p>
              <a href="https://wereld.blink.nl/7-8/smart-life" className="fat-link"><span>Naar de <em>lessen</em></span></a>
            </article>
          </div>
        </div>
      </div>
    );
  }
});
