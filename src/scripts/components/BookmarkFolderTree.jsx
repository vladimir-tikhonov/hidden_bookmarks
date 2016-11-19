import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {
    loadBookmarkFolders,
    bookmarkFoldersIdsRestored,
    bookmarkFoldersIdsSelected,
    bookmarkFoldersIdsDeselected} from 'scripts/actions/bookmark_folders.js';
import {getBookmarkFolders} from 'scripts/reducers/index.js';
import {getRootBookmark, getSelectedIds} from 'scripts/reducers/bookmark_folders.js';
import BookmarkFolder from 'scripts/components/BookmarkFolder.jsx';
import storage from 'scripts/services/Storage.js';
import bookmarkFolderHelper from 'scripts/helpers/bookmark_folder.js';

class BookmarkFolderTree extends React.PureComponent {
    onBookmarkFolderToggle(bookmarkFolder, isChecked) {
        if (isChecked) {
            this.onFolderChecked(bookmarkFolder);
        } else {
            this.onFolderUnchecked(bookmarkFolder);
        }
    }

    onFolderChecked(bookmarkFolder) {
        this.props.onIdsSelected([
            bookmarkFolder.id,
            ...bookmarkFolderHelper.getAdditionalIdsToSelect(bookmarkFolder, this.props.selectedIds),
        ]);
    }

    onFolderUnchecked(bookmarkFolder) {
        this.props.onIdsDeselected([
            bookmarkFolder.id,
            ...bookmarkFolderHelper.getAdditionalIdsToDeselect(bookmarkFolder),
        ]);
    }

    onSaveButtonClicked() {
        storage.setHiddenBookmarkFolderIds(this.props.selectedIds);
    }

    onResetButtonClicked() {
        storage.getHiddenBookmarkFolderIds().then(ids => {
            this.props.onIdsRestored(ids);
        });
    }

    onUpdateButtomClicked() {
        this.props.loadBookmarkFolders();
    }

    render() {
        const {rootBookmark} = this.props;

        return (
            <div>
                <BookmarkFolder
                    bookmarkFolder={rootBookmark}
                    selectedIds={this.props.selectedIds}
                    onToggle={this.onBookmarkFolderToggle.bind(this)}
                />
                <div>
                    <button onClick={() => this.onSaveButtonClicked()}>Save</button>
                    <button onClick={() => this.onResetButtonClicked()}>Reset</button>
                    <button onClick={() => this.onUpdateButtomClicked()}>Reload</button>
                </div>
            </div>
        );
    }
}

BookmarkFolderTree.propTypes = {
    rootBookmark: PropTypes.object,
    loadBookmarkFolders: PropTypes.func.isRequired,
    selectedIds: PropTypes.array.isRequired,
    onIdsRestored: PropTypes.func.isRequired,
    onIdsSelected: PropTypes.func.isRequired,
    onIdsDeselected: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const bookmarkFoldersState = getBookmarkFolders(state);

    return {
        rootBookmark: getRootBookmark(bookmarkFoldersState),
        selectedIds: getSelectedIds(bookmarkFoldersState),
    };
};

const mapDispatchToProps = (dispatch) => ({
    loadBookmarkFolders: () => dispatch(loadBookmarkFolders()),
    onIdsRestored: ids => dispatch(bookmarkFoldersIdsRestored(ids)),
    onIdsSelected: ids => dispatch(bookmarkFoldersIdsSelected(ids)),
    onIdsDeselected: ids => dispatch(bookmarkFoldersIdsDeselected(ids)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkFolderTree);
