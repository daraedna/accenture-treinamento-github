import React from 'react';
import './App.css';
import link from './assets/link.png'

class App extends React.Component{
  state = {
    search: '',
    user: {},
    repo: [],
    loading: false
  }

  handleTextChange(){
    this.setState({ loading: true });
    fetch(`https://api.github.com/users/${this.state.search}`)
      .then(res => res.json())
      .then(res => {
        if(res.id){
          const dataFormatted = {
            avatar_url: res.avatar_url,
            name: res.name,
            repos_url: res.repos_url,
            username: res.login
          }
          this.setState({ user: dataFormatted, search: '', loading: false, repo: [] });

        }else {
          alert(res.message);
          this.setState({ loading: false });
        }
      })
  }

  handleRepository(){
    fetch(`${this.state.user.repos_url}`)
      .then(res => res.json())
      .then(res => {
        this.setState({ repo: res });
      })
  }

  render(){
    return(
      <div className="app">
        <header className="header">
          <h1>Consulta Github</h1>
        </header>
        <div className="content">
          <div className="search-user">
              <label>Digite o usuário:</label>
              <input
                className="input"
                type="text"
                value={this.state.search}
                onChange={(e) => this.setState({ search: e.target.value })}
              />
              <button
                disabled={!this.state.search ? true : false}
                className="btn-primary"
                onClick={this.handleTextChange.bind(this)}
              >
                Consultar
              </button>
              {this.state.loading && (
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
              )}

              {!this.state.loading && Object.values(this.state.user).length !== 0 && (
                <div className="data-info">
                  <img src={this.state.user.avatar_url}/>
                  <h3>{this.state.user.name}</h3>
                  <p>@{this.state.user.username}</p>
                  <button
                    className="btn-primary"
                    onClick={this.handleRepository.bind(this)}
                    >
                    Buscar Repositorios
                  </button>
                </div>
              )}
          </div>

          <div className="repository-container">
            {this.state.repo.length !== 0 && <h3>Repositorios</h3>}
            <div className="repository">
            {this.state.repo.length !== 0 && this.state.repo.map((repo) => {
              return(
                <div className="card-repository" key={repo.id}>
                  <h4>{repo.name}</h4>
                  <div className="card-infos">
                    <span>{repo.language}</span>
                    <a href={repo.html_url} target="_blank">
                      <img src={link} width={30}/>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
          </div>
        </div>
    </div>
    )
  }
}

export default App;
