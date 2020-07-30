import React from 'react'

import cx from 'classnames'

import axios from 'axios'

import styles from './App.module.scss'

const HTTP = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Token ${process.env.REACT_APP_ACCESS_TOKEN}`,
  },
})

function App() {
  const [repos, setRepos] = React.useState([])

  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    handleInitial()
  }, [])

  const handleSearch = (q) => {
    const query = encodeURIComponent(q)
    setIsLoading(true)
    HTTP.get(`/search/repositories?q=${query}&sort=stars&order=desc`)
      .then((response) => setRepos(response.data.items))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }

  const handleInitial = () => {
    setIsLoading(true)
    HTTP.get('/repositories')
      .then((response) => setRepos(response.data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }

  const handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      const keyword = evt.target.value
      if (keyword === '') {
        handleInitial()
      } else {
        handleSearch(keyword)
      }
    }
  }

  const _buidlTopArea = () => {
    return (
      <div className={cx(styles.App__header, 'bg-primary')}>
        <div className="p-3 d-flex flex-row">
          <div className="flex-grow-1">
            <h6>Search Repositories</h6>
            <div>
              <input
                type="text"
                className="form-control m-0"
                aria-describedby="helpId"
                placeholder="e.g HTML"
                onKeyUp={handleKeyUp}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const _buildListItem = (repo) => {
    return (
      <div className={cx('d-flex p-2 align-items-center', styles.Repo)}>
        <img src={repo.owner.avatar_url} alt={repo.full_name} />
        <div className="pl-4 d-flex flex-column flex-grow-1">
          <h6 className="font-weight-bold">
            <a href={repo.html_url}>{repo.full_name}</a>
          </h6>
          <p>{repo.description}</p>
        </div>
        <a href={repo.html_url} className="btn btn-sm btn-primary">
          Follow
        </a>
      </div>
    )
  }

  const _buildListItems = () => {
    return (
      <ul className="list-group">
        {repos.map((repo) => {
          return (
            <li key={repo.id} className="list-group-item">
              {_buildListItem(repo)}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className={cx(styles.App, 'container')}>
      {_buidlTopArea()}
      <div className="mb-2"></div>
      {isLoading ? (
        <p className="text-center">Please Wait...</p>
      ) : (
        _buildListItems()
      )}
    </div>
  )
}

export default App
