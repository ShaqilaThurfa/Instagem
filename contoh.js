<View style={{ flex: 1 }}>
      {/* Tombol untuk membuka modal */}
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: "#007BFF", borderRadius: 5 }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Add Comment</Text>
      </TouchableOpacity>

      {/* Modal Tambah Komentar */}
      <AddCommentModal
        postId={postId}
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>